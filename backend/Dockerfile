FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

ENV NUGET_PACKAGES=/src/.nuget/packages

COPY Cineverse/Cineverse.Domain/Cineverse.Domain.csproj Cineverse.Domain/
COPY Cineverse/Cineverse.Application/Cineverse.Application.csproj Cineverse.Application/
COPY Cineverse/Cineverse.Infrastructure/Cineverse.Infrastructure.csproj Cineverse.Infrastructure/
COPY Cineverse/Cineverse.API/Cineverse.API.csproj Cineverse.API/

RUN dotnet restore Cineverse.API/Cineverse.API.csproj

COPY Cineverse/. .
RUN dotnet publish Cineverse.API/Cineverse.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Cineverse.API.dll"]