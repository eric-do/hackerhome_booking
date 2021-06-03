# Rental home reservations module

This is the backend code for a home reservations module.

It was build and deployed with the following structure:
- 1 EC2 instance of NGINX
- 5 EC2 instances of application code
- 1 EC2 instance of redis


The project was tested and optimized using the following technologies:
- Artillery for local testing
- Loader.io for deployed testing
- New Relic for traffic dashboard
- PSQL / Node for seeding 30M rows of data

The project was successfully able to handle a throughput of 1k RPS with 20ms response time.

## Table of Contents

1. [Usage](#Usage)
2. [Schema](#schema)
3. [CRUD operations](#crud-operations)


## Usage

### Helpful Linux commands
sudo -u postgres psql
sudo vim /var/lib/pgsql9/data/pg_hba.conf
sudo /etc/init.d/postgresql restart / sudo service postgresql restart

### Install NGINX
EC2: https://medium.com/@nishankjaintdk/setting-up-a-node-js-app-on-a-linux-ami-on-an-aws-ec2-instance-with-nginx-59cbc1bcc68c
```
> sudo service nginx restart
```

### Install Redis
[EC2](https://medium.com/@feliperohdee/installing-redis-to-an-aws-ec2-machine-2e2c4c443b68)
[OSX](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298)

### Install Postgres DB
[EC2](https://github.com/snowplow/snowplow/wiki/Setting-up-PostgreSQL)
[OSX](https://gist.github.com/ibraheem4/ce5ccd3e4d7a65589ce84f2a3b7c23a3)

### Additional configurations on EC2
Certai operations such as schemq imports will require granting SUPERUSER access.
```
postgres=# ALTER USER "ec2-user" WITH SUPERUSER;
```

### Create import file
```
> cd db/postgres
> mkdir import_files
> cd ..
> node seed_generator_pg.js
```

### Seed DB
1. Run schema
```
> postgres=# CREATE DATABASE airbnb;
> psql -d airbnb -a -f db/postgres/schema_pg.sql
```

Amazon EC2 only: 
- Move all import files to /tmp
- Make sure import script is updated to reflect path to tmp
```
[ec2-user@ip-172-31-18-194 import_files]$ mv bookings.csv.gz /tmp/bookings.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv rooms.csv.gz /tmp/rooms.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv transations.csv.gz /tmp/transactions.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv transactions.csv.gz /tmp/transactions.csv.gz
[ec2-user@ip-172-31-18-194 import_files]$ mv users.csv.gz /tmp/users.csv.gz
```

```
[ec2-user@ip-172-31-20-48 import_files]$ zcat bookings.csv.gz > bookings.csv
[ec2-user@ip-172-31-20-48 import_files]$ zcat rooms.csv.gz > rooms.csv
[ec2-user@ip-172-31-20-48 import_files]$ zcat transactions.csv.gz > transactions.csv
[ec2-user@ip-172-31-20-48 import_files]$ zcat users.csv.gz > users.csv
```

Then import files
```
> psql -d airbnb -a -f db//postgres/import.sql
```
4. Modify schema with indexes and foreign keys
```
> psql -d airbnb -a -f db/postgres/alter_fk.sql
```
## Schema
![image](/media/schema_postgres.png)

## CRUD operations
### Create / POST
#### Book room
- Method: POST
- URL: ‘/bookings'
- Input: JSON object (roomId, email, check in/out, etc)
- Output: booking information (json array)

### Read / GET
#### Get booking information for a single booking
- Method: GET
- URL: ‘/bookings/:bookingId'
- Input: none
- Output: an array of room objects

#### Get room information for a single room
- Method: GET
- URL: ‘/rooms/:roomId
- Output: room information (json array)

### Update / PUT
#### Update information for a single booking
- Method: PUT
- URL: ‘/bookings/:bookingId’
- Input: JSON object (email, check in/out, etc)
- Output: booking information (json array)

### Delete / DELETE
#### Delete a single booking
- Method: DELETE
- URL: ‘/bookings/:bookingId’
- Input: None
- Output: Confirmation

