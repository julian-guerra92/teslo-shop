import { Controller, Get} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators';
import { SeedService } from './seed.service';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@ApiTags('Seed') //Decorador utilzado para etiqueta en endpoint de documentación
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }

}

/*
  Se agrega el decorador @Auth en el Get del seed para que sólo perfiles administradores puedan ejecutarlo. Para esto se expone el servicio desde el módulo de Auth y se importan en Seed
*/