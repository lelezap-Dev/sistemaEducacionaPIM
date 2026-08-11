# ============================================================================
#  Dockerfile — Sistema Acadêmico Colaborativo Lumina
#  PIM IV — Etapa 8 (Infraestrutura em Nuvem e DevOps)
#
#  Construção em múltiplos estágios (multi-stage build):
#    Estágio 1 (build)   — compila a solução com o SDK completo
#    Estágio 2 (runtime) — carrega apenas o runtime e os binários
#
#  O SDK do .NET ocupa cerca de 800 MB; o runtime, cerca de 220 MB.
#  Separar os estágios faz com que essa diferença não vá para a imagem
#  final, reduzindo superfície de ataque e tempo de implantação.
# ============================================================================

# ── Estágio 1: compilação ───────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /origem

# Copia primeiro apenas os arquivos de projeto e restaura os pacotes.
# Como o Docker guarda cada camada em cache, as dependências só são
# baixadas de novo quando um .csproj muda — e não a cada alteração de
# código, o que acelera bastante as builds seguintes.
COPY SistemaEducacional.slnx ./
COPY src/SistemaEducacional.Domain/*.csproj          ./src/SistemaEducacional.Domain/
COPY src/SistemaEducacional.Infrastructure/*.csproj  ./src/SistemaEducacional.Infrastructure/
COPY src/SistemaEducacional.Application/*.csproj     ./src/SistemaEducacional.Application/
COPY src/SistemaEducacional.API/*.csproj             ./src/SistemaEducacional.API/
RUN dotnet restore SistemaEducacional.slnx

# Agora sim o código-fonte completo
COPY . .
RUN dotnet publish src/SistemaEducacional.API/SistemaEducacional.API.csproj \
        --configuration Release \
        --output /app/publicado \
        --no-restore

# ── Estágio 2: execução ─────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# As imagens oficiais do .NET 8 em diante já trazem um usuário sem
# privilégios chamado "app" e expõem seu identificador na variável
# APP_UID. Aproveitá-lo é mais seguro do que criar outro usuário: a
# imagem base é enxuta e sequer inclui o utilitário adduser.
COPY --from=build --chown=$APP_UID:$APP_UID /app/publicado .
USER $APP_UID

# Porta fixa dentro do contêiner. O mapeamento para o mundo externo é
# responsabilidade de quem executa a imagem (docker compose, Render,
# Kubernetes). Provedores que injetam a variável PORT exigem que
# ASPNETCORE_URLS seja ajustada na configuração do serviço.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Verificação de saúde: consulta o endpoint /health, que confirma que a
# aplicação responde E que o banco está acessível. A imagem base não traz
# curl nem wget, por isso a requisição é feita pelo próprio runtime .NET.
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD ["dotnet", "SistemaEducacional.API.dll", "--verificar-saude"]

ENTRYPOINT ["dotnet", "SistemaEducacional.API.dll"]
