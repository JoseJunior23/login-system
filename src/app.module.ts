import { Module } from '@nestjs/common';
import { ConfigurationModule } from '@shared/infra/configurations/configuration.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigurationModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
