# Rancher

```bash
docker run -d --restart=unless-stopped -p 80:80 -p 5443:443 -v "/etc/letsencrypt/live/poulad.ml/fullchain.pem:/etc/rancher/ssl/cert.pem:ro" -v "/etc/letsencrypt/live/poulad.ml/privkey.pem:/etc/rancher/ssl/key.pem:ro" --name rancher rancher/rancher:latest


docker logs --follow rancher
```
