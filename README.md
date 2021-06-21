Microservice-based online shop for face detection on images

Main parts:
- identity (NestJS) - User login and registration (actually it should be splitted to two or more services
- orders-api (NestJS) - serves orders workflow and notifies other services about order lifecycle by emmitting messages
- billing-api (NestJS) - server payments workflow and user account fullfilling. Of course, without real money :)
- notifications-api (NestJS) - mock service for email notifications: grabs interesting events from message bus and creates email templates in databases
- image-processor (.Net 5 + openCV) - retrieves image blobs, detect faces and upload it back to storage server
- portal (CRA + Ant Design) - UI for customers.
- common (TypeScript) - shared library

Infrastructure:
- Minikube (in future plans - Azure)
- Helm 3, Skaffold
- Ambassador Edge Stack
- Prometheus + Grafana
- Postman/Newman
- MinIO
- Github packages


Future plans:
- migrate to cloud
- make [service templates](https://microservices.io/patterns/service-template.html) for NodeJS / .Net Core
- test coverage (unit, e2e, integration)
- decouple `identity`
- code refactoring, upgrade
- yarn/lerna-based monorepo
