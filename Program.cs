using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SistemaEducacional.Data;
using SistemaEducacional.Services;

// ================================================================
//  Program.cs — ponto de entrada da aplicação.
//  Aqui registramos todos os serviços e configuramos o pipeline
//  de requisições HTTP.
// ================================================================

var builder = WebApplication.CreateBuilder(args);

// ── 1. Banco de Dados ────────────────────────────────────────────
// Registra o DbContext com a string de conexão do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure(3)  // tenta 3x em caso de queda temporária
    )
);

// ── 2. Autenticação JWT ──────────────────────────────────────────
// JWT = JSON Web Token. Após o login, o servidor devolve um token
// que o front-end guarda e envia em cada requisição.
// O servidor verifica a assinatura do token sem precisar do banco.
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ── 3. Serviços da aplicação ─────────────────────────────────────
// Cada "Service" contém a lógica de negócio (ex: criar turma,
// matricular aluno, calcular ranking). Os Controllers chamam os
// Services — nunca acessam o banco diretamente.
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<MateriaService>();
builder.Services.AddScoped<TurmaService>();
builder.Services.AddScoped<AtividadeService>();
builder.Services.AddScoped<RelatorioService>();
builder.Services.AddScoped<SessaoService>();

// ── 4. Controllers e JSON ────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opt =>
    {
        // Envia datas como strings ISO 8601 (padrão internacional)
        opt.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// ── 5. CORS ──────────────────────────────────────────────────────
// CORS permite que o front-end (rodando em outra porta) acesse a API.
// Em desenvolvimento liberamos tudo; em produção restringimos.
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontEnd", policy =>
        policy.WithOrigins(
                "http://localhost:5500",   // Live Server do VS Code
                "http://127.0.0.1:5500",
                "http://localhost:3000",
                "http://localhost:8080"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

// ── 6. Swagger ───────────────────────────────────────────────────
// Swagger gera uma página interativa em /swagger onde você pode
// testar todos os endpoints da API sem precisar de Postman.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title   = "Sistema Educacional API",
        Version = "v1",
        Description = "API do Sistema Educacional — UNIP PIM III"
    });

    // Configura o Swagger para aceitar o token JWT no header Authorization
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Token JWT. Exemplo: Bearer {seu_token}",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ════════════════════════════════════════════════════════════════
var app = builder.Build();
// ════════════════════════════════════════════════════════════════

// ── Pipeline de requisições ──────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sistema Educacional v1");
        c.RoutePrefix = "swagger";
    });
}

// Serve os arquivos HTML/CSS/JS do front-end na pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("FrontEnd");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Redireciona qualquer rota não encontrada para o index.html
// (necessário para o front-end funcionar com rotas client-side)
app.MapFallbackToFile("index.html");

// ── Seed: garante coluna Status, admin ativo e hash correto ──────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Adiciona coluna Status caso o banco já exista sem ela
    db.Database.ExecuteSqlRaw(@"
        IF NOT EXISTS (
            SELECT 1 FROM sys.columns
            WHERE object_id = OBJECT_ID(N'Usuarios') AND name = N'Status'
        )
        BEGIN
            ALTER TABLE Usuarios
            ADD Status nvarchar(20) NOT NULL DEFAULT 'Ativo';
        END
    ");

    var admin = db.Usuarios.FirstOrDefault(u => u.Cpf == "00000000000");

    if (admin == null)
    {
        db.Usuarios.Add(new SistemaEducacional.Models.Usuario
        {
            Cpf          = "00000000000",
            Nome         = "Administrador",
            Email        = "admin@escola.com",
            SenhaHash    = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Perfil       = "Secretaria",
            PalavraChave = "sistema",
            Status       = "Ativo"
        });
        db.SaveChanges();
    }
    else
    {
        if (!BCrypt.Net.BCrypt.Verify("Admin@123", admin.SenhaHash))
            admin.SenhaHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");

        // Garante que o admin nunca fique pendente
        admin.Status = "Ativo";
        db.SaveChanges();
    }
}

app.Run();
