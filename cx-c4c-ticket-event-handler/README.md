# CX C4C Ticket Event handler example

## Pre-requisites

- [Install Docker](https://docs.docker.com/get-docker/) (or any other Container tool).
- Create an account at [https://hub.docker.com/](https://hub.docker.com/) (or any other Container Image Library). 
- Create a [SendGrid account](https://sendgrid.com/solutions/email-api/) for sending emails.
- [Get a Free Account on SAP BTP Trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html).
- [Enable SAP BTP, Kyma Runtime](https://developers.sap.com/tutorials/cp-kyma-getting-started.html).
- [Download and install the Kubernetes Command Line Tool](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#d81e7789-ced4-4df6-b4a0-132d8c637077).
- [Test the kubectl installation](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#4709f3b9-b9bc-45f1-89c1-cd6f097c55f5).
- [Download the Kyma runtime kubeconfig](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#2ef10816-b759-4080-a8ec-eadbc3317ebd).

## Build and deployment steps

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
