import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { CanActivateFn } from '@angular/router';

describe('AuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
  TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

beforeEach(() => {
TestBed.configureTestingModule({});
});

it('should be created', () => {
expect(executeGuard).toBeTruthy();
});
});
