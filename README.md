# Déploiement de l'Infrastructure : Kubernetes avec Istio

## Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Configuration de Kubernetes et Istio](#configuration-de-kubernetes-et-istio)
  - [Étape 1 : Configuration des déploiements Kubernetes](#étape-1--configuration-des-déploiements-kubernetes)
  - [Étape 2 : Istio Gateway et VirtualService](#étape-2--istio-gateway-et-virtualservice)
- [Intégration Frontend et Backend](#intégration-frontend-et-backend)
- [Communication entre Services](#communication-entre-services)
- [Deploiement sur Google Cloud](#Déploiement-sur-le-Cloud)
- [Conclusion](#conclusion)

---
###Réalisé Par 
- Moussa Akram NOUI
- Mohamed Achref NOUI
## Vue d'ensemble

Ce projet illustre la mise en place d'une architecture multi-services avec Kubernetes et Istio. L'objectif est de déployer deux services (backend et frontend), de les faire communiquer entre eux via Kubernetes, et d'exposer ces services de manière sécurisée grâce à Istio.

Vous pouvez accéder à l'application déployée sur Google Cloud en suivant ce lien : [Application déployée sur GCloud](https://frontend-prog-dist-746679393655.us-central1.run.app). 

>Notez que le chargement peut prendre un peu de temps en raison du lancement de l'instance en hibernation.

> Toutes les captures sont dans le rapport .docx


Voici une capture d'écran de l'application déployée :

![Capture d'écran de l'application](./1.png)

### Services déployés :

- **Backend** : API REST déployée sur Kubernetes.
- **Frontend** : Application web accessible via Kubernetes.
- **Istio** : Utilisé pour la gestion du trafic et la communication entre services.

---

## Configuration de Kubernetes et Istio

### Étape 1 : Configuration des déploiements Kubernetes

#### Déploiement du Backend

Pour déployer le service backend :

```bash
kubectl apply -f backend-deployment.yaml
```

Cela crée le déploiement et le service pour le backend en utilisant l'image Docker spécifiée.

#### Déploiement du Frontend

Le frontend est déployé avec un fichier similaire :

```bash
kubectl apply -f frontend-deployment.yaml
```

#### Vérification des Déploiements

Pour vérifier que les déploiements ont été appliqués correctement :

```bash
kubectl get deployments
```

### Étape 2 : Istio Gateway et VirtualService

#### Création de la Gateway Istio

La Gateway Istio est utilisée pour gérer le trafic entrant :

```bash
kubectl apply -f gateway.yaml
```

#### Création des VirtualServices

Les VirtualServices dirigent les requêtes entrantes vers les services internes :

```bash
kubectl apply -f backend-vs.yaml
kubectl apply -f frontend-vs.yaml
```

#### Vérification des VirtualServices

Pour vérifier leur création :

```bash
kubectl get virtualservices
```

---

## Intégration Frontend et Backend

### Connexion du Frontend au Backend

Le frontend envoie des requêtes au backend via l'URL interne Kubernetes :

```
http://backend-service.default.svc.cluster.local:80
```

### Mise à Jour du Déploiement du Frontend

Dans le fichier `frontend-deployment.yaml`, ajoutez la variable d'environnement pour le backend :

```yaml
env:
  - name: BACKEND_URL
    value: "http://backend-service.default.svc.cluster.local:80"
```

Appliquez la configuration mise à jour :

```bash
kubectl apply -f frontend-deployment.yaml
```

---

## Communication entre Services

### Configuration de la Communication

- **Backend** : Exposé via un Service Kubernetes nommé `backend-service`.
- **Frontend** : Configure une variable d'environnement `BACKEND_URL` pointant vers l'URL du backend.
- **Istio Gateway** : Gère les requêtes externes et redirige les requêtes appropriées aux services internes.

### Flux de Communication

1. Les requêtes externes arrivent à la Gateway Istio.
2. Les VirtualServices d'Istio dirigent les requêtes vers le frontend ou le backend.
3. Le frontend communique avec le backend via l'URL interne du service Kubernetes.

---

## Preuves d'Exécution

### Vérification des Services

#### Résultat Backend

En accédant à l'adresse `http://127.0.0.1/backend`, le backend renvoie les données attendues. Cela confirme que le service backend est opérationnel.

#### Résultat Frontend

En accédant à l'adresse `http://127.0.0.1`, l'application frontend s'affiche correctement et peut interagir avec le backend.


#### Déploiement sur le Cloud
Déploiement sur Google Cloud Platform (GCP)
Pour tester l'infrastructure sur le cloud, les deux services ont été déployés sur un cluster Kubernetes hébergé sur GCP. Voici une capture d'écran illustrant le déploiement des services backend et frontend sur GCP.

> Toutes les captures sont dans le rapport .docx


---

## Conclusion

Ce projet montre comment utiliser Kubernetes et Istio pour déployer et gérer une architecture multi-services. Grâce à Istio, nous avons exposé les services de manière sécurisée et configuré la communication entre eux. Cette solution est évolutive et adaptée pour des environnements de production complexes.

