# 🏠 RentGuard - Blockchain Rental Management Platform

![RentGuard Banner](https://via.placeholder.com/800x200/0f0f23/00d4ff?text=RentGuard+-+Blockchain+Rental+Management)

RentGuard es una plataforma revolucionaria de gestión de propiedades de alquiler construida sobre la blockchain de Stellar. Ofrece pagos seguros, transparentes y eficientes para el sector inmobiliario, con soporte completo para testnet y mainnet.

## ✨ Características Principales

- 🔐 **Pagos Seguros**: Todas las transacciones están protegidas por la tecnología blockchain de Stellar
- ⚡ **Transacciones Instantáneas**: Confirmaciones en 3-5 segundos con tarifas mínimas
- 🏢 **Gestión de Propiedades**: Herramientas completas para propietarios y inquilinos
- 🌐 **Soporte Multi-red**: Testnet para desarrollo y Mainnet para producción
- 💼 **Dashboard Intuitivo**: Panel de control moderno con analytics en tiempo real
- 🔄 **Automatización**: Contratos inteligentes para el cumplimiento automático de acuerdos
- 📱 **Responsive Design**: Interfaz optimizada para todos los dispositivos

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Stellar SDK** - Integración con la blockchain de Stellar
- **Joi** - Validación de datos
- **Jest** - Framework de testing

### Frontend
- **React 18** - Biblioteca de UI
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animaciones
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Git

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Klorenn/Rent-Guard.git
cd Rent-Guard
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del backend
npm install

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar las variables según sea necesario
nano .env
```

### 4. Configuración de Variables de Entorno

```env
# Configuración del Servidor
PORT=3001
NODE_ENV=development

# Configuración de Stellar
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL_TESTNET=https://horizon-testnet.stellar.org
STELLAR_HORIZON_URL_MAINNET=https://horizon.stellar.org

# Claves de Seguridad (Generar nuevas para producción)
JWT_SECRET=tu-clave-secreta-jwt-aqui
ENCRYPTION_KEY=tu-clave-de-encriptacion-de-32-caracteres

# URL del Frontend
FRONTEND_URL=http://localhost:3000
```

## 🚀 Ejecución

### Desarrollo

```bash
# Ejecutar backend y frontend simultáneamente
npm run dev

# O ejecutar por separado:

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Producción

```bash
# Construir frontend
npm run build

# Ejecutar servidor
npm start
```

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas del frontend
cd frontend
npm test
```

## 🌐 Redes de Stellar

### Testnet (Desarrollo)
- **Horizon URL**: https://horizon-testnet.stellar.org
- **Friendbot**: https://friendbot.stellar.org
- **Network Passphrase**: Test SDF Network ; September 2015

### Mainnet (Producción)
- **Horizon URL**: https://horizon.stellar.org
- **Network Passphrase**: Public Global Stellar Network ; September 2015

## 📖 Uso de la API

### Endpoints Principales

#### Stellar
- `GET /api/stellar/network` - Información de la red actual
- `POST /api/stellar/network` - Cambiar red (testnet/mainnet)
- `POST /api/stellar/keypair` - Generar nuevo par de claves
- `GET /api/stellar/account/:publicKey` - Información de cuenta
- `POST /api/stellar/fund` - Fondear cuenta de prueba (solo testnet)
- `POST /api/stellar/payment` - Crear transacción de pago
- `POST /api/stellar/submit` - Enviar transacción

#### Propiedades
- `GET /api/properties` - Listar propiedades
- `POST /api/properties` - Crear propiedad
- `GET /api/properties/:id` - Obtener propiedad
- `PUT /api/properties/:id` - Actualizar propiedad
- `DELETE /api/properties/:id` - Eliminar propiedad

#### Rentas
- `GET /api/rentals` - Listar acuerdos de renta
- `POST /api/rentals` - Crear acuerdo de renta
- `POST /api/rentals/payment` - Procesar pago de renta
- `GET /api/rentals/:id/payments` - Historial de pagos

### Ejemplo de Uso

```javascript
// Generar nuevo par de claves
const response = await fetch('/api/stellar/keypair', {
  method: 'POST'
});
const { publicKey, secretKey } = await response.json();

// Fondear cuenta de prueba (solo testnet)
await fetch('/api/stellar/fund', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ publicKey })
});

// Crear propiedad
const property = await fetch('/api/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Apartamento Moderno',
    description: 'Hermoso apartamento en el centro',
    address: 'Calle Principal 123',
    monthlyRent: 100,
    currency: 'XLM',
    landlordPublicKey: publicKey
  })
});
```

## 🎨 Interfaz de Usuario

### Páginas Principales

1. **Home** - Página de inicio con características y estadísticas
2. **Properties** - Lista y gestión de propiedades
3. **Property Detail** - Detalles de propiedad específica
4. **Create Property** - Formulario para crear nuevas propiedades
5. **Rentals** - Gestión de acuerdos de renta
6. **Wallet** - Gestión de billetera Stellar
7. **Dashboard** - Panel de control con analytics

### Características de la UI

- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **Tema Oscuro**: Interfaz moderna con tema oscuro
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Notificaciones**: Sistema de notificaciones en tiempo real
- **Selector de Red**: Cambio fácil entre testnet y mainnet

## 🔧 Configuración Avanzada

### Personalización de Redes

Puedes agregar redes personalizadas modificando el archivo `config.js`:

```javascript
const config = {
  stellar: {
    customNetwork: {
      horizonUrl: 'https://your-custom-horizon.com',
      passphrase: 'Your Custom Network ; 2024'
    }
  }
};
```

### Variables de Entorno Adicionales

```env
# Base de datos (opcional para futuras implementaciones)
DATABASE_URL=postgresql://user:password@localhost:5432/rentguard

# Configuración de CORS
CORS_ORIGIN=http://localhost:3000

# Configuración de Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Despliegue

### Heroku

```bash
# Crear aplicación en Heroku
heroku create rentguard-app

# Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set STELLAR_NETWORK=mainnet

# Desplegar
git push heroku main
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN cd frontend && npm install && npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

### Vercel/Netlify

Para el frontend, puedes desplegar en Vercel o Netlify:

```bash
# Vercel
cd frontend
vercel

# Netlify
cd frontend
npm run build
# Subir carpeta 'build' a Netlify
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [Wiki del proyecto](https://github.com/Klorenn/Rent-Guard/wiki)
- **Issues**: [GitHub Issues](https://github.com/Klorenn/Rent-Guard/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/Klorenn/Rent-Guard/discussions)
- **Email**: contact@rentguard.com

## 🙏 Agradecimientos

- [Stellar Development Foundation](https://stellar.org/) por la increíble blockchain
- [React Team](https://reactjs.org/) por el framework de UI
- [Styled Components](https://styled-components.com/) por el CSS-in-JS
- [Framer Motion](https://www.framer.com/motion/) por las animaciones

## 📊 Roadmap

- [ ] Integración con base de datos PostgreSQL
- [ ] Sistema de notificaciones por email/SMS
- [ ] Aplicación móvil nativa
- [ ] Integración con servicios de pago tradicionales
- [ ] Sistema de reputación para usuarios
- [ ] Contratos inteligentes avanzados
- [ ] Integración con servicios de verificación de identidad
- [ ] Dashboard de analytics avanzado
- [ ] API GraphQL
- [ ] Soporte para múltiples criptomonedas

---

**¡Construido con ❤️ usando Stellar blockchain technology!**

Para más información, visita [https://stellar.org](https://stellar.org) y [https://github.com/Klorenn/Rent-Guard](https://github.com/Klorenn/Rent-Guard)
