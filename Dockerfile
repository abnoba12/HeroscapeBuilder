# Stage 1: Build React and WebAPI with Node and .NET SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Install Node.js in the .NET SDK image
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy all files and restore dependencies
COPY . .
RUN dotnet restore

# Build React and WebAPI
WORKDIR /app/heroscapebuilder.client
RUN npm install && npm run build

WORKDIR /app
RUN dotnet publish -c Release -o out

# Stage 2: Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Expose the API port (adjust as necessary)
EXPOSE 7194

# Start WebAPI and serve React files
ENTRYPOINT ["dotnet", "HeroscapeBuilder.Server.dll"]