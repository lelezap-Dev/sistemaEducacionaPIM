using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SistemaEducacional.Infrastructure.Data;
using SistemaEducacional.Application.Services;

// ================================================================
//  Program.cs — ponto de entrada da aplicação.
//  Aqui registramos todos os serviços e configuramos o pipeline
//  de requisições HTTP.
// ================================================================

var builder = WebApplication.CreateBuilder(args);

// ── 0. Validação dos segredos ────────────────────────────────────
// Dados sensíveis NÃO ficam no appsettings.json (que é versionado).
// Em desenvolvimento vêm do User Secrets; em produção, de variáveis
// de ambiente. Se faltarem, a aplicação para aqui com erro claro em
// vez de falhar depois com uma exceção confusa.
static string ExigirConfig(IConfiguration cfg, string chave)
{
    var valor = cfg[chave];
    if (string.IsNullOrWhiteSpace(valor))
        throw new InvalidOperationException(
            $"Configuração obrigatória ausente: '{chave}'. " +
            "Em desenvolvimento use: dotnet user-secrets set \"" + chave + "\" \"<valor>\". " +
            "Em produção, defina a variável de ambiente correspondente.");
    return valor;
}

var connectionString = ExigirConfig(builder.Configuration, "ConnectionStrings:DefaultConnection");
var jwtKey           = ExigirConfig(builder.Configuration, "Jwt:Key");

// Chave HMAC-SHA256 precisa de no mínimo 256 bits (32 bytes) para ser segura
if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException(
        "'Jwt:Key' precisa ter no mínimo 32 bytes para assinatura HMAC-SHA256.");

// ── 1. Banco de Dados ────────────────────────────────────────────
// Registra o DbContext com a string de conexão validada acima
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        connectionString,
        sql => sql.EnableRetryOnFailure(3)  // tenta 3x em caso de queda temporária
    )
);

// ── 2. Autenticação JWT ──────────────────────────────────────────
// JWT = JSON Web Token. Após o login, o servidor devolve um token
// que o front-end guarda e envia em cada requisição.
// O servidor verifica a assinatura do token sem precisar do banco.
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
// CORS permite que clientes servidos de outra origem acessem a API.
// O app mobile nativo (Expo) não envia cabeçalho Origin, então não é
// afetado por CORS — a política abaixo atende o front-end web e o
// Expo rodando em modo web durante o desenvolvimento.
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontEnd", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Em desenvolvimento o Metro/Expo sobe em portas variáveis e
            // o celular acessa pelo IP da máquina na rede local.
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(
                    "http://localhost:5500",   // Live Server do VS Code
                    "http://127.0.0.1:5500",
                    "http://localhost:3000",
                    "http://localhost:8080"
                  )
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
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

    var adminCpf    = app.Configuration["Admin:Cpf"]!;
    var adminSenha  = app.Configuration["Admin:SenhaInicial"]!;
    var adminEmail  = app.Configuration["Admin:Email"]!;
    var adminChave  = app.Configuration["Admin:PalavraChave"]!;

    var admin = db.Usuarios.FirstOrDefault(u => u.Cpf == adminCpf);

    if (admin == null)
    {
        db.Usuarios.Add(new SistemaEducacional.Domain.Entities.Usuario
        {
            Cpf          = adminCpf,
            Nome         = "Administrador",
            Email        = adminEmail,
            SenhaHash    = BCrypt.Net.BCrypt.HashPassword(adminSenha),
            Perfil       = "Secretaria",
            PalavraChave = adminChave,
            Status       = "Ativo"
        });
        db.SaveChanges();
    }
    else
    {
        if (!BCrypt.Net.BCrypt.Verify(adminSenha, admin.SenhaHash))
            admin.SenhaHash = BCrypt.Net.BCrypt.HashPassword(adminSenha);

        // Garante que o admin nunca fique pendente
        admin.Status = "Ativo";
        db.SaveChanges();
    }
}

app.Run();
