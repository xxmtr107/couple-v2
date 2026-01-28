# Anniversary Backend

## Cấu trúc thư mục

```
src/main/java/com/couple/anniversary/
├── AnniversaryBackendApplication.java     # Main application class
├── common/                                 # Shared components
│   ├── config/                            # Configuration classes
│   │   └── WebConfig.java
│   ├── constant/                          # Application constants
│   │   └── AppConstants.java
│   ├── dto/                               # Common DTOs
│   │   └── ApiResponse.java
│   └── exception/                         # Exception handling
│       ├── BadRequestException.java
│       ├── ForbiddenException.java
│       ├── GlobalExceptionHandler.java
│       └── ResourceNotFoundException.java
├── domain/                                 # Business domains
│   ├── auth/                              # Authentication module
│   │   ├── controller/
│   │   │   └── AuthController.java
│   │   ├── dto/
│   │   │   ├── AuthResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   └── RegisterRequest.java
│   │   └── service/
│   │       └── AuthService.java
│   ├── media/                             # Media management module
│   │   ├── controller/
│   │   │   └── MediaController.java
│   │   ├── dto/
│   │   │   ├── MediaFileResponse.java
│   │   │   └── MediaUploadRequest.java
│   │   ├── entity/
│   │   │   └── MediaFile.java
│   │   ├── repository/
│   │   │   └── MediaFileRepository.java
│   │   └── service/
│   │       └── MediaService.java
│   └── user/                              # User management module
│       ├── entity/
│       │   └── User.java
│       ├── repository/
│       │   └── UserRepository.java
│       └── service/
│           └── UserService.java
└── security/                              # Security configuration
    ├── CustomUserDetailsService.java
    ├── JwtAuthenticationFilter.java
    ├── JwtService.java
    └── SecurityConfig.java
```

## Các tính năng

- **Authentication**: Đăng ký, đăng nhập với JWT
- **Media Management**: Upload, download, xóa file media (ảnh/video)
- **Security**: JWT-based authentication, BCrypt password encoding

## Cấu hình

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USERNAME` | Database username | root |
| `DB_PASSWORD` | Database password | root |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRATION` | JWT expiration time (ms) | 86400000 |
| `UPLOAD_DIR` | Upload directory path | C:/anniversary_uploads |
| `CORS_ORIGINS` | Allowed CORS origins | http://localhost:5173 |
| `SERVER_PORT` | Server port | 8080 |

### Profiles

- `dev`: Development profile with debug logging
- `prod`: Production profile with optimized settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập

### Media
- `GET /api/media` - Lấy danh sách media files
- `POST /api/media/upload` - Upload file
- `GET /api/media/{id}/download` - Download file
- `DELETE /api/media/{id}` - Xóa file

## Build & Run

```bash
# Development
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production
mvn clean package -DskipTests
java -jar target/anniversary-backend-*.jar --spring.profiles.active=prod
```
