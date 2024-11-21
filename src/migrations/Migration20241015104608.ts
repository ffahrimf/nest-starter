import { Migration } from '@mikro-orm/migrations';

export class Migration20241015104608 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`province\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`,
    );

    this.addSql(
      `create table \`city\` (\`id\` int unsigned not null auto_increment primary key, \`uuid\` varchar(255) not null, \`created_at\` datetime not null, \`created_by\` int null, \`updated_at\` datetime not null, \`updated_by\` int null, \`deleted_at\` date null, \`deleted_by\` int null, \`province_id\` int unsigned not null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`city\` add index \`city_province_id_index\`(\`province_id\`);`,
    );

    this.addSql(
      `alter table \`city\` add constraint \`city_province_id_foreign\` foreign key (\`province_id\`) references \`province\` (\`id\`) on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`city\` drop foreign key \`city_province_id_foreign\`;`,
    );

    this.addSql(`drop table if exists \`province\`;`);

    this.addSql(`drop table if exists \`city\`;`);
  }
}
