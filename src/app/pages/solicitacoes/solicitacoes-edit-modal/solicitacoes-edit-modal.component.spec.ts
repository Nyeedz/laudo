import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesEditModalComponent } from './solicitacoes-edit-modal.component';

describe('SolicitacoesEditModalComponent', () => {
  let component: SolicitacoesEditModalComponent;
  let fixture: ComponentFixture<SolicitacoesEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitacoesEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacoesEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
