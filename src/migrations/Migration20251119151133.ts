import { Migration } from '@mikro-orm/migrations';

export class Migration20251119151133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`province\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`city\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`province_id\` int unsigned not null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`city\` add index \`city_province_id_index\`(\`province_id\`);`);

    this.addSql(`create table \`role\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`user\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`username\` varchar(255) not null, \`name\` varchar(255) not null, \`email\` varchar(255) not null, \`email_verified_at\` int null, \`password\` varchar(255) not null, \`role_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add index \`user_role_id_index\`(\`role_id\`);`);

    this.addSql(`create table \`superadmin\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`user_id\` int unsigned not null, \`photo\` varchar(255) null, \`name\` varchar(255) not null, \`email\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`birth_date\` datetime not null, \`gender\` varchar(255) not null, \`status\` tinyint(1) not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`superadmin\` add index \`superadmin_user_id_index\`(\`user_id\`);`);

    this.addSql(`alter table \`city\` add constraint \`city_province_id_foreign\` foreign key (\`province_id\`) references \`province\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`user\` add constraint \`user_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on update cascade;`);

    this.addSql(`alter table \`superadmin\` add constraint \`superadmin_user_id_foreign\` foreign key (\`user_id\`) references \`user\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`city\` drop foreign key \`city_province_id_foreign\`;`);

    this.addSql(`alter table \`user\` drop foreign key \`user_role_id_foreign\`;`);

    this.addSql(`alter table \`superadmin\` drop foreign key \`superadmin_user_id_foreign\`;`);

    this.addSql(`drop table if exists \`province\`;`);

    this.addSql(`drop table if exists \`city\`;`);

    this.addSql(`drop table if exists \`role\`;`);

    this.addSql(`drop table if exists \`user\`;`);

    this.addSql(`drop table if exists \`superadmin\`;`);
  }

}
