import { SetMetadata } from '@nestjs/common';

export const Role = (role: 'admin' | 'voter') => SetMetadata('role', role);
