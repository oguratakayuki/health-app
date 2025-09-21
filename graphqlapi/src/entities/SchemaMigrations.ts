import { Column, Entity } from "typeorm";

@Entity("schema_migrations", { schema: "health_development" })
export class SchemaMigrations {
  @Column("varchar", { primary: true, name: "version", length: 255 })
  version!: string;
}
