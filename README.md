1. IAM-User erstellen und Berechtigungen erteilen (Cloudformation, S3, EC2, API-Gateway)
2. Credentials erstellen und als GitHub Secrets abspeichern (`AWS_ACCESS_KEY_ID` und `AWS_SECRET_ACCESS_KEY`)
3. Wenn nicht eingeloggt: `aws sso login` oder Credentials abspeichern.
4. Frontend-Stack deployen:
```
aws cloudformation deploy \
  --template-file infra/frontend.yaml \
  --stack-name frontend-stack \
  --capabilities CAPABILITY_NAMED_IAM
```
5. Frontend in `public/` erstellen und pushen, um GitHub Frontend-Workflow zu starten (alternativ erstmal händisch in den Bucket laden)
