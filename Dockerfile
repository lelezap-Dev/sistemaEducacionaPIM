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

# Executa como usuário sem privilégios: se a aplicação for comprometida,
# o invasor não recebe root dentro do contêiner.
RUN adduser --disabled-password --gecos "" --uid 1001 lumina
USER lumina

COPY --from=build --chown=lumina:lumina /app/publicado .

# A porta é definida pela variável PORT quando existir (o Render e outros
# PaaS a injetam); caso contrário, 8080.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Verificação de saúde: o orquestrador reinicia o contêiner se a API
# parar de responder.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["dotnet", "--info"]

ENTRYPOINT ["dotnet", "SistemaEducacional.API.dll"]
