FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files first to restore dependencies (caches layer if dependencies haven't changed)
COPY ["AirportAdmin.API/AirportAdmin.API.csproj", "AirportAdmin.API/"]
RUN dotnet restore "AirportAdmin.API/AirportAdmin.API.csproj"

# Copy full source and publish
COPY . .
WORKDIR "/src/AirportAdmin.API"
RUN dotnet publish "AirportAdmin.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AirportAdmin.API.dll"]