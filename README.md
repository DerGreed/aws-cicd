1. IAM-User erstellen und Berechtigungen erteilen (CloudFormation, CloudFront, S3, EC2, API-Gateway)
2. Credentials erstellen und als GitHub Repo Secrets abspeichern (`AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY`)
3. Wenn nicht eingeloggt: `aws sso login` oder Credentials abspeichern.
4. Frontend-Stack deployen:
   ```
   aws cloudformation deploy \
     --template-file infra/frontend.yml \
     --stack-name frontend-stack \
     --capabilities CAPABILITY_NAMED_IAM
   ```
   Das Frontend ist erreichbar über folgende Adresse:
   ```
   BUCKET=$(aws cloudformation describe-stacks \
     --stack-name frontend-stack \
     --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" \
     --output text)
   echo "http://$BUCKET.s3-website.eu-central-1.amazonaws.com
   ```
5. Frontend in `public/` erstellen und pushen, um GitHub Frontend-Workflow zu starten (alternativ erstmal händisch in den Bucket laden mit `aws s3 sync public/ s3://$BUCKET/`)
6. SSH-Schlüsselpaar erstellen mit
   ```
   ssh-keygen -t rsa -b 4096 -C "backend-deploy" -N "" -f "secrets/backend_key"
   ```  
   und private Key als GitHub Repo Secret abspeichern (`SSH_PRIVATE_KEY`)
7. Backend deployen:
   ```
   aws cloudformation deploy \
      --template-file infra/backend.yml \
      --stack-name backend-stack \
      --parameter-overrides SshPublicKey="$(cat secrets/backend_key.pub)" \
      --capabilities CAPABILITY_NAMED_IAM
   ```
8. Public IP der neu erstellten EC2-Instanz herausfinden:  
   ```
   EC2IP=$(aws cloudformation describe-stacks \
     --stack-name backend-stack \
     --query "Stacks[0].Outputs[?OutputKey=='BackendPublicIp'].OutputValue" \
     --output text)
   ```
   und zusammen mit dem Namen des Users (`ec2-user`) als GitHub Repo Secret speichern (`EC2_HOST` und `EC2_USER`)
9. Backend in `backend/` erstellen (inkl. `docker-compose.yml` im aktuellen Ordner) und pushen für automatisches Deployment
10. Um Frontend und Backend zu verbinden, muss ein API-Gateway erstellt werden (IP durch die entsprechende ersetzen):
    ```
    aws cloudformation deploy \
      --template-file infra/api-gateway.yml \
      --stack-name backend-api-gateway \
      --parameter-overrides BackendUrl="http://$EC2IP:3000" \
      --capabilities CAPABILITY_NAMED_IAM
    ```
11. Im Frontend die URL des Backends eintragen, um API zu nutzen:
   ```
   aws cloudformation describe-stacks \
   --stack-name backend-api-gateway \
   --query "Stacks[0].Outputs[?OutputKey=='ApiInvokeUrl'].OutputValue" \
   --output text
   ```