# Stage 1: Build React Client
FROM node:18 AS client-build
WORKDIR /app/heroscapebuilder.client

# Copy React client dependencies and install
COPY heroscapebuilder.client/package*.json ./
RUN npm install

# Copy the rest of the React client source files and build
COPY heroscapebuilder.client/ ./
RUN npm run build

# Debug step to verify React build output
RUN ls -la /app/heroscapebuilder.client/dist

# Stage 2: Build .NET WebAPI
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /app

# Copy only the WebAPI project file to restore dependencies
COPY HeroscapeBuilder.Server/*.csproj ./HeroscapeBuilder.Server/
RUN dotnet restore ./HeroscapeBuilder.Server/HeroscapeBuilder.Server.csproj

# Copy the rest of the WebAPI source files and publish
COPY HeroscapeBuilder.Server/ ./HeroscapeBuilder.Server/
WORKDIR /app/HeroscapeBuilder.Server
RUN dotnet publish -c Release -o /publish

# Debug step to verify WebAPI output
RUN ls -la /publish

# Stage 3: Combine into Final Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy WebAPI published files from api-build
COPY --from=api-build /publish .

# Copy built React client files from client-build
COPY --from=client-build /app/heroscapebuilder.client/dist ./wwwroot

# Expose the WebAPI port
EXPOSE 7194

# Start the WebAPI
ENTRYPOINT ["dotnet", "HeroscapeBuilder.Server.dll"]