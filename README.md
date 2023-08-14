# Instalación y despliegue
```bash
PROJECT=randock-tech-interview; git clone https://github.com/ByDSA/$PROJECT && sudo -E $PROJECT/bin/up.sh
```

La forma más fácil de probar la aplicación es a través de la documentación OpenAPI de Swagger. URL:
```
http://localhost:8080/api/v1/docs
```

Alternativamente se puede probar con Curl:
```bash
curl -X 'POST' \
  'http://localhost:8080/api/v1/fuel-stations/search' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "cp": 46100,
  "type": "G95E5"
}'
```

# Descripción
## Contenedores
Contenedores en la aplicación:
| Contenedor | Puerto | Descripción |
| --- | --- | --- |
| backend | 8080 | La aplicación backend en sí |

## Formatos
En la documentación de Swagger se puede ver la especificación OpenAPI de la aplicación. En la misma se puede ver que la aplicación tiene un único endpoint:
```
POST /api/v1/fuel-stations/search
```

El endpoint recibe un JSON con los siguientes parámetros:
| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| cp | Number | Código postal |
| type | String | Tipo de combustible |

El endpoint devuelve un JSON con la siguiente estructura:
| Parámetro | Tipo | Descripción |
| --- | --- | --- |
| name | String | Nombre de la gasolinera |
| price | Number | Precio del combustible |
| address | String | Dirección de la gasolinera |
| url | String | URL de Google Maps con la ubicación de la gasolinera |