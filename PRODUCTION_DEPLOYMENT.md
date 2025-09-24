# 🚀 Production Deployment Guide

## Prerequisites

1. **Server with Ubuntu 20.04+ or CentOS 7+**
2. **Domain name pointing to your server IP**
3. **Docker and Docker Compose installed**
4. **Root or sudo access**

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd master_sps
```

### 2. Configure Domain
Edit `production.env` and `nginx.prod.conf`:
- Replace `yourdomain.com` with your actual domain
- Update email for SSL certificate

### 3. Deploy with HTTPS
```bash
./deploy-production.sh yourdomain.com your-email@example.com
```

## Manual Deployment

### 1. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Certbot for SSL
sudo apt install certbot -y
```

### 2. Configure Environment
```bash
# Copy production environment
cp production.env .env

# Edit with your domain
nano .env
```

### 3. Generate SSL Certificate
```bash
# Stop any service on port 80
sudo systemctl stop apache2 nginx

# Generate certificate
sudo certbot certonly --standalone --non-interactive --agree-tos --email your-email@example.com -d yourdomain.com

# Copy certificates
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/cert.pem ssl/key.pem
```

### 4. Deploy Services
```bash
# Build and start
docker compose -f docker-compose.prod.yml --env-file production.env up --build -d

# Check status
docker ps
```

### 5. Setup Auto-Renewal
```bash
# Add to crontab
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --renew-hook 'docker compose -f docker-compose.prod.yml restart nginx'") | crontab -
```

## Verification

### Check Services
```bash
# All services should be running
docker ps

# Test endpoints
curl -I https://yourdomain.com
curl -I https://yourdomain.com/admin
curl -I https://yourdomain.com/api/leads
```

### Check Logs
```bash
# View logs
docker compose -f docker-compose.prod.yml logs

# Follow logs
docker compose -f docker-compose.prod.yml logs -f
```

## Security Checklist

- ✅ SSL certificate installed and working
- ✅ HTTPS redirect configured
- ✅ Security headers added
- ✅ Rate limiting enabled
- ✅ Firewall configured (ports 80, 443 only)
- ✅ Database password changed
- ✅ JWT secrets configured
- ✅ Auto-renewal setup

## Troubleshooting

### SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check nginx config
docker exec master_sps_nginx nginx -t
```

### Service Issues
```bash
# Restart specific service
docker compose -f docker-compose.prod.yml restart nginx

# View logs
docker logs master_sps_nginx
docker logs master_sps_backend
```

### Database Issues
```bash
# Check database
docker exec -it master_sps_db mysql -u root -p

# Backup database
docker exec master_sps_db mysqldump -u root -p master_sps_db > backup.sql
```

## Monitoring

### Health Checks
- Frontend: `https://yourdomain.com/health`
- API: `https://yourdomain.com/api/leads`
- Admin: `https://yourdomain.com/admin`

### Logs Location
- Nginx: `/var/log/nginx/`
- Application: `docker logs <container_name>`

## Backup

### Database Backup
```bash
# Create backup
docker exec master_sps_db mysqldump -u root -p master_sps_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i master_sps_db mysql -u root -p master_sps_db < backup.sql
```

### Files Backup
```bash
# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d_%H%M%S).tar.gz backend/uploads/

# Backup SSL certificates
tar -czf ssl_backup_$(date +%Y%m%d_%H%M%S).tar.gz ssl/
```

## Performance Optimization

### Nginx Optimization
- Gzip compression enabled
- Static file caching
- Rate limiting configured

### Database Optimization
- Connection pooling
- Indexes on frequently queried columns
- Regular backups

### Monitoring
- Set up monitoring for CPU, memory, disk usage
- Monitor SSL certificate expiration
- Set up alerts for service failures

## Support

For issues or questions:
1. Check logs: `docker logs <container_name>`
2. Verify configuration: `docker exec master_sps_nginx nginx -t`
3. Test connectivity: `curl -I https://yourdomain.com`
4. Check SSL: `openssl s_client -connect yourdomain.com:443`