# S/4HANA Cloud Business Partner Management - Hands-on Exercise

## Overview & architecture 

Simple <b>Business Partner Management</b> application to read, create and update Business Partners of the category type Person in S/4. It’s being designed and built to be successfully deployed and run on BTP Kyma trial accounts (For that reason it does not use the Event Mesh capabilities as the default plan for the event message clients is not available in trial accounts (it does not use the Event Mesh capabilities as the default plan for the event message clients is not available in trial accounts).

![image](https://user-images.githubusercontent.com/22198951/140536171-da59b410-1ccd-4a8e-aa57-626c8a65c7e9.png)

## Pre-requisites, build and deployment steps

1. Build the docker image of the **c4c-mock microservice**. 

	- cd cx-c4c-ticket-event-handler/c4c-mock

	- docker build . -t `<docker-username>`/c4c-mock -f Dockerfile

	> Note: Replace `<docker-username>` with your username

2. Push the docker image of the **c4c-mock microservice** to your Container Image Library.

	- docker push `<docker-username>`/c4c-mock
	
	> Note: Replace `<docker-username>` with your username

3. Update the docker image in the ./c4c-mock/deployment/k8s.yaml file.

	> Note: Replace `<docker-username>` with your username

4. Create/update Kubernetes resources of the **c4c-mock microservice**.

	- kubectl apply -f ./c4c-mock/deployment/k8s.yaml
	- kubectl apply -f ./c4c-mock/deployment/kyma.yaml

5. Update the values of the `SENDGRID_API_KEY` & `SENDGRID_SENDER_EMAIL` environment variables in the  ./ticket-event-handler/k8s/function.yaml file, which can be got from your SendGrid account.

6. Create/update Kubernetes resources of the **ticket-event-handler serverless function**.

	- kubectl apply -f ./ticket-event-handler/k8s/function.yaml
