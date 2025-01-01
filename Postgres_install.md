To install the latest version of PostgreSQL, follow the steps below depending on your operating system.

---

### **For Linux (Ubuntu/Debian)**

1. **Add the PostgreSQL APT Repository**:
   ```bash
   sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
   ```

2. **Import the Repository Signing Key**:
   ```bash
   wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
   ```

3. **Update the Package Lists**:
   ```bash
   sudo apt update
   ```

4. **Install PostgreSQL**:
   ```bash
   sudo apt install postgresql
   ```

5. **Verify the Installation**:
   ```bash
   psql --version
   ```
---

6. **Install PostGIS**:
	'''bash
	sudo apt install postgis
	'''

Some other help:
https://tecadmin.net/install-postgis-on-ubuntu/