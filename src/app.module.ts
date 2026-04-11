import { Module } from '@nestjs/common';
import { ConfigurationModule } from '@shared/infra/configurations/configuration.module';

@Module({
  imports: [ConfigurationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
