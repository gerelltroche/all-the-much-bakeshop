# All the Much Bake Shop - Infrastructure User Stories

_DevOps, Deployment, and Infrastructure Requirements_

## User Personas

### Infrastructure Users
1. **Gerell (The Developer)** - Needs to deploy, maintain, and update the website reliably
2. **Katie (The Business Owner)** - Needs the site to be always available and reliable for customers
3. **GitHub Actions (The Automation)** - Automated deployment system
4. **Future Gerell (The Maintainer)** - Six months from now when something breaks

---

## Infrastructure User Stories

### Initial Raspberry Pi Setup

**IUS-001:** As a developer, I want a one-time setup script for my Raspberry Pi so that I can configure all necessary software with a single command

**IUS-002:** As a developer, I want Docker installed and configured on my Pi so that I can run containerized applications reliably

**IUS-003:** As a developer, I want Docker Compose installed so that I can orchestrate multiple containers together

**IUS-004:** As a developer, I want my user added to the Docker group so that I don't need sudo for every Docker command

**IUS-005:** As a developer, I want rclone installed and configured so that I can backup to Google Drive

**IUS-006:** As a developer, I want a dedicated project directory structure so that all files are organized and easy to find

**IUS-007:** As a developer, I want Git configured on my Pi so that I can clone and update the repository

---

### Docker Configuration

**DKR-001:** As a developer, I want a multi-stage Dockerfile so that my production image is optimized and small

**DKR-002:** As a developer, I want the Next.js app to run in standalone mode so that Docker images are as small as possible

**DKR-003:** As a developer, I want a non-root user in my Docker container so that the application runs securely

**DKR-004:** As a developer, I want a .dockerignore file so that unnecessary files aren't copied into my Docker image

**DKR-005:** As a developer, I want a docker-compose.yml file so that I can manage all services together

**DKR-006:** As a developer, I want containers to restart automatically so that the site comes back up after a Pi reboot

**DKR-007:** As a developer, I want health checks on my containers so that I know when something is broken

**DKR-008:** As a developer, I want a dedicated Docker network so that containers can communicate securely

**DKR-009:** As a developer, I want persistent volumes for uploaded images so that Katie's product photos aren't lost on redeploy

**DKR-010:** As a developer, I want old Docker images cleaned up automatically so that my Pi's disk doesn't fill up

---

### Cloudflare Setup

**CF-001:** As a developer, I want to use Cloudflare Tunnel so that I don't have to expose my home IP address or configure port forwarding

**CF-002:** As a developer, I want the Cloudflare Tunnel running as a Docker container so that it's managed alongside the application

**CF-003:** As a developer, I want automatic SSL certificates through Cloudflare so that the site is always HTTPS

**CF-004:** As a developer, I want Cloudflare's CDN enabled so that the site loads fast for customers everywhere

**CF-005:** As a developer, I want DDoS protection through Cloudflare so that the bakery site stays up even if attacked

**CF-006:** As a developer, I want the tunnel token stored as an environment variable so that it's not committed to Git

**CF-007:** As a customer, I want the website to load quickly regardless of my location so that I have a good experience (via Cloudflare CDN)

**CF-008:** As a developer, I want DNS configured to point allthemuchbakeshop.com to the Cloudflare Tunnel so that customers can reach the site

---

### Environment Variables & Configuration

**ENV-001:** As a developer, I want a .env.production file on my Pi so that secrets are separate from code

**ENV-002:** As a developer, I want SendGrid API keys stored as environment variables so that email functionality works

**ENV-003:** As a developer, I want Katie's contact information stored as environment variables so that I can update it easily

**ENV-004:** As a developer, I want the Cloudflare Tunnel token stored as an environment variable so that the tunnel authenticates properly

**ENV-005:** As a developer, I want a template .env.example file in the repo so that I remember what variables are needed

**ENV-006:** As a developer, I want .env files in .gitignore so that secrets never get committed to GitHub

**ENV-007:** As a developer, I want clear documentation of what each environment variable does so that I can troubleshoot issues

---

### GitHub Actions CI/CD

**GHA-001:** As a developer, I want GitHub Actions to automatically deploy when I push to main so that deployments are hands-free

**GHA-002:** As a developer, I want the deployment to SSH into my Pi so that it can trigger updates remotely

**GHA-003:** As a developer, I want SSH keys stored as GitHub Secrets so that credentials are secure

**GHA-004:** As a developer, I want the deployment to pull the latest code so that changes are reflected on the live site

**GHA-005:** As a developer, I want the deployment to create a backup before deploying so that I can rollback if something breaks

**GHA-006:** As a developer, I want Docker containers rebuilt with no cache so that I always get a fresh, clean build

**GHA-007:** As a developer, I want old Docker images cleaned up after deployment so that disk space doesn't run out

**GHA-008:** As a developer, I want a health check after deployment so that I know if the deployment succeeded

**GHA-009:** As a developer, I want the deployment to fail gracefully if something goes wrong so that I'm alerted to issues

**GHA-010:** As a developer, I want deployment status notifications so that I know when deployments complete or fail

**GHA-011:** As a developer, I want the ability to manually trigger a deployment so that I can redeploy without pushing code

**GHA-012:** As a developer, I want deployment logs available in GitHub so that I can troubleshoot failed deployments

---

### Backup & Recovery

**BCK-001:** As a developer, I want automated daily backups so that data is protected without manual intervention

**BCK-002:** As a developer, I want backups to include application code so that I can restore the entire site if needed

**BCK-003:** As a developer, I want backups to include uploaded product photos so that Katie's images are safe

**BCK-004:** As a developer, I want backups to include environment variables so that configuration is preserved

**BCK-005:** As a developer, I want backups to include Docker configuration so that I can recreate the exact setup

**BCK-006:** As a developer, I want backups uploaded to Google Drive so that they're stored off-site and safe from Pi failures

**BCK-007:** As a developer, I want backups timestamped so that I can identify when each backup was created

**BCK-008:** As a developer, I want old backups automatically deleted after 30 days so that Google Drive doesn't fill up

**BCK-009:** As a developer, I want a backup script that runs before each deployment so that I can rollback bad deployments

**BCK-010:** As a developer, I want a restore script so that I can quickly recover from disasters

**BCK-011:** As a developer, I want backup logs so that I can verify backups are working correctly

**BCK-012:** As a developer, I want the ability to manually trigger a backup so that I can backup before risky changes

**BCK-013:** As Katie, I want the site data automatically backed up so that my business is protected even if I don't understand the technical details

---

### Monitoring & Health Checks

**MON-001:** As a developer, I want automated health checks every 5 minutes so that I know if the site goes down

**MON-002:** As a developer, I want to monitor if the Docker container is running so that I can detect crashes

**MON-003:** As a developer, I want to monitor if the website is responding so that I know if there are service issues

**MON-004:** As a developer, I want to monitor disk space usage so that I can prevent the Pi from running out of storage

**MON-005:** As a developer, I want health check logs so that I can review the site's uptime history

**MON-006:** As a developer, I want alerts if health checks fail so that I can respond to outages quickly

**MON-007:** As a developer, I want to view Docker container logs easily so that I can troubleshoot issues

**MON-008:** As a developer, I want to view resource usage (CPU, RAM, disk) so that I know if the Pi is struggling

**MON-009:** As a developer, I want container restart counts monitored so that I can detect if something is repeatedly crashing

**MON-010:** As Katie, I want to be notified if the website goes down so that I can tell customers when to expect it back

---

### Security

**SEC-001:** As a developer, I want SSH key-based authentication to my Pi so that password attacks are impossible

**SEC-002:** As a developer, I want the Docker container running as a non-root user so that security vulnerabilities are limited

**SEC-003:** As a developer, I want secrets stored as environment variables so that they're never committed to Git

**SEC-004:** As a developer, I want GitHub Secrets for sensitive deployment data so that credentials are protected

**SEC-005:** As a developer, I want the application to run behind Cloudflare so that my home IP is never exposed

**SEC-006:** As a developer, I want automatic HTTPS through Cloudflare so that customer data is encrypted

**SEC-007:** As a developer, I want regular security updates on the Pi so that vulnerabilities are patched

**SEC-008:** As a developer, I want Docker images to use official Node.js Alpine base images so that the attack surface is minimized

**SEC-009:** As a developer, I want rate limiting through Cloudflare so that the site is protected from abuse

**SEC-010:** As a customer, I want my order form data transmitted securely so that my personal information is protected

---

### Email & Notifications

**EMAIL-001:** As a developer, I want SendGrid configured and tested so that order notifications work reliably

**EMAIL-002:** As a developer, I want Katie to receive both email and SMS when orders come in so that she never misses a customer (via email-to-SMS gateway)

**EMAIL-003:** As a developer, I want customers to receive order confirmation emails so that they know their request was received

**EMAIL-004:** As a developer, I want email templates that match the brand so that communications feel professional

**EMAIL-005:** As a developer, I want email sending to handle failures gracefully so that form submissions don't break if SendGrid is down

**EMAIL-006:** As a developer, I want email sending to be logged so that I can troubleshoot delivery issues

**EMAIL-007:** As Katie, I want to receive text messages immediately when orders come in so that I can respond quickly to customers

**EMAIL-008:** As a developer, I want to test email sending in development without actually sending emails so that I don't spam anyone

---

### Maintenance & Operations

**OPS-001:** As a developer, I want clear documentation of all setup steps so that I can recreate the environment if needed

**OPS-002:** As a developer, I want a list of all required environment variables so that I don't miss any configuration

**OPS-003:** As a developer, I want quick reference commands documented so that I can manage the site efficiently

**OPS-004:** As a developer, I want a runbook for common issues so that I can fix problems quickly

**OPS-005:** As a developer, I want to be able to view logs from anywhere so that I can troubleshoot remotely

**OPS-006:** As a developer, I want to be able to restart services remotely so that I can fix issues without physical access to the Pi

**OPS-007:** As a developer, I want the deployment process to have zero downtime so that customers never see the site go offline

**OPS-008:** As a developer, I want the ability to rollback deployments quickly so that I can undo bad changes

**OPS-009:** As a developer, I want automated cleanup of old resources so that the Pi doesn't accumulate cruft

**OPS-010:** As Future Gerell, I want everything documented clearly so that I can maintain the site even after not looking at it for months

---

## Implementation Phases

### Phase 1: Initial Setup (Week 1)
- IUS-001 through IUS-007: Set up Raspberry Pi
- DKR-001 through DKR-005: Basic Docker configuration
- ENV-001 through ENV-007: Environment variable setup
- SEC-001 through SEC-003: Basic security

### Phase 2: Cloudflare & Hosting (Week 1)
- CF-001 through CF-008: Cloudflare Tunnel setup
- DKR-006 through DKR-009: Docker production configuration
- SEC-004 through SEC-006: Hosting security

### Phase 3: CI/CD Pipeline (Week 2)
- GHA-001 through GHA-012: GitHub Actions deployment
- OPS-001 through OPS-003: Documentation

### Phase 4: Backup & Monitoring (Week 2)
- BCK-001 through BCK-013: Backup system
- MON-001 through MON-010: Monitoring and health checks

### Phase 5: Email & Notifications (Week 3)
- EMAIL-001 through EMAIL-008: SendGrid integration

### Phase 6: Polish & Production Readiness (Week 3)
- DKR-010: Cleanup automation
- SEC-007 through SEC-010: Advanced security
- OPS-004 through OPS-010: Operations documentation
- Final testing of all systems

---

## Success Criteria

### Deployment Success
- âœ… Code pushed to GitHub automatically deploys to production
- âœ… Deployment takes less than 5 minutes
- âœ… Site remains available during deployment (zero downtime)
- âœ… Failed deployments rollback automatically
- âœ… Deployment status is visible in GitHub

### Reliability Success
- âœ… Site is accessible 24/7 at allthemuchbakeshop.com
- âœ… HTTPS works correctly with valid certificate
- âœ… Site loads in under 3 seconds
- âœ… Site survives Pi reboots (containers auto-restart)
- âœ… Health checks detect and alert on failures

### Backup Success
- âœ… Daily backups run automatically without intervention
- âœ… Backups are uploaded to Google Drive successfully
- âœ… Restore process can recover full site in under 10 minutes
- âœ… Can restore to any backup from the last 30 days

### Security Success
- âœ… No secrets committed to Git
- âœ… Home IP address not exposed publicly
- âœ… SSH uses key-based authentication only
- âœ… All traffic uses HTTPS
- âœ… Containers run as non-root users

### Operational Success
- âœ… Can deploy from anywhere with just a Git push
- âœ… Can view logs remotely
- âœ… Can restart services remotely
- âœ… Documentation is clear enough for Future Gerell
- âœ… Katie receives order notifications reliably

---

## Scripts & Tools Required

### Setup Scripts
- `setup-pi.sh` - One-time Pi configuration (IUS-001)
- `configure-cloudflare.sh` - Cloudflare Tunnel setup (CF-001)
- `setup-rclone.sh` - Google Drive backup configuration (BCK-006)

### Deployment Scripts
- `deploy.sh` - Manual deployment script (for testing)
- `.github/workflows/deploy.yml` - Automated deployment (GHA-001)

### Backup Scripts
- `backup.sh` - Create and upload backup (BCK-001)
- `restore.sh` - Restore from backup (BCK-010)

### Monitoring Scripts
- `health-check.sh` - System health verification (MON-001)
- `check-disk-space.sh` - Disk usage monitoring (MON-004)

### Maintenance Scripts
- `cleanup.sh` - Remove old Docker images and backups (OPS-009)
- `update-system.sh` - Update Pi and Docker (SEC-007)
- `view-logs.sh` - Easy log access (OPS-005)
- `restart-services.sh` - Restart containers (OPS-006)

---

## Configuration Files Required

### Docker
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Service orchestration
- `.dockerignore` - Exclude unnecessary files

### GitHub
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `.github/workflows/health-check.yml` (optional) - Scheduled health checks

### Environment
- `.env.example` - Template for required variables
- `.env.production` - Actual secrets (on Pi only, not in Git)

### Application
- `next.config.js` - Next.js production configuration
- `.gitignore` - Exclude secrets and build artifacts

### Cloudflare
- `cloudflared-config.yml` - Tunnel configuration (generated)

### Backup
- `rclone.conf` - Google Drive configuration (generated)
- `backup-schedule` - Crontab entries

---

## Testing Checklist

### Pre-Launch Testing
- [ ] Fresh Pi setup completes successfully
- [ ] Docker containers build and run
- [ ] Cloudflare Tunnel connects and routes traffic
- [ ] HTTPS works with valid certificate
- [ ] Order form sends emails to Katie
- [ ] Katie receives SMS notifications
- [ ] Email signup works
- [ ] All pages load correctly
- [ ] Mobile responsive works
- [ ] Images load and display properly

### Deployment Testing
- [ ] Push to main triggers deployment
- [ ] Deployment completes successfully
- [ ] Site remains available during deployment
- [ ] Changes appear on live site
- [ ] Failed deployment triggers alert
- [ ] Can manually trigger deployment

### Backup Testing
- [ ] Daily backup runs automatically
- [ ] Backup appears in Google Drive
- [ ] Can download and extract backup
- [ ] Restore script works correctly
- [ ] Restored site functions properly

### Monitoring Testing
- [ ] Health checks run every 5 minutes
- [ ] Health checks detect site down
- [ ] Disk space warnings trigger correctly
- [ ] Can view logs remotely
- [ ] Resource usage is monitored

### Security Testing
- [ ] Cannot SSH with password
- [ ] Secrets not in Git history
- [ ] HTTPS enforced (HTTP redirects)
- [ ] Containers run as non-root
- [ ] Home IP not exposed in headers

---

## Runbook - Common Issues

### Issue: Site is down
1. Check if container is running: `docker ps`
2. If not running: `docker-compose up -d`
3. Check logs: `docker-compose logs -f bakeshop`
4. Check Cloudflare Tunnel: `docker-compose logs cloudflared`

### Issue: Deployment failed
1. Check GitHub Actions log
2. SSH to Pi: `ssh pi@your-pi-ip`
3. Check container logs: `docker-compose logs`
4. Rollback if needed: `./scripts/restore.sh <backup-file>`

### Issue: Out of disk space
1. Clean old Docker images: `docker image prune -a`
2. Clean old backups: `find /home/pi/backups -mtime +30 -delete`
3. Check what's using space: `du -sh /*`

### Issue: Order emails not sending
1. Check SendGrid API key is set: `env | grep SENDGRID`
2. Check SendGrid dashboard for errors
3. Test email sending: `curl -X POST localhost:3000/api/test-email`
4. Check logs: `docker-compose logs bakeshop | grep email`

### Issue: Need to rollback deployment
1. Find backup: `rclone ls gdrive:BakeshopBackups`
2. Download backup: `rclone copy gdrive:BakeshopBackups/<file> /tmp/`
3. Run restore: `./scripts/restore.sh /tmp/<file>`

---

## Future Enhancements (Phase 2+)

### Infrastructure Improvements
- **Load balancing:** Run multiple containers for redundancy
- **Database:** Add PostgreSQL if needed for future features
- **CDN:** Store images on Cloudflare R2 or Cloudinary
- **Monitoring dashboard:** Grafana + Prometheus for detailed metrics
- **Automated testing:** Add E2E tests in CI/CD pipeline
- **Staging environment:** Separate staging site for testing
- **Blue-green deployments:** Even safer zero-downtime deployments

### Notification Improvements
- **Real SMS:** Use Twilio instead of email-to-SMS
- **Discord/Slack notifications:** For deployment status
- **Uptime monitoring:** UptimeRobot or similar external monitoring
- **Error tracking:** Sentry integration for application errors

### Backup Improvements
- **Database backups:** If database is added
- **Incremental backups:** Only backup changes (save space)
- **Multiple backup destinations:** S3 + Google Drive for redundancy
- **Automated restore testing:** Verify backups work monthly

---

## Notes for Future Gerell

Remember these things when you come back to this project in 6 months:

1. **The Pi is at:** `your-home-network/pi-hostname`
2. **SSH command:** `ssh pi@your-pi-ip` (uses SSH key)
3. **Project location:** `/home/pi/all-the-much-bake-shop`
4. **Logs command:** `docker-compose logs -f bakeshop`
5. **Restart command:** `docker-compose restart`
6. **Deploy command:** Just push to GitHub main branch
7. **Backup location:** Google Drive > BakeshopBackups folder
8. **SendGrid dashboard:** https://app.sendgrid.com
9. **Cloudflare dashboard:** https://dash.cloudflare.com
10. **Remember:** You built this to be simple. Don't overthink it.

**Emergency contacts:**
- Katie's phone: [Add when known]
- Katie's email: [Add when known]
- Your email: [Your email]

**Credentials locations:**
- SSH keys: `~/.ssh/id_ed25519_bakeshop`
- Environment variables: `/home/pi/all-the-much-bake-shop/.env.production`
- GitHub Secrets: Repository Settings > Secrets and Variables > Actions
- SendGrid API key: In .env.production and SendGrid dashboard

---

_Last updated: October 2025_
_Remember: Keep it simple, keep it documented, keep it backed up._