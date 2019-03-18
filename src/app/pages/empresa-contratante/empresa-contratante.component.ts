import { Component, OnInit } from "@angular/core";
import { EmpresaContratanteService } from "src/app/services/empresa-contratante/empresa-contratante.service";

@Component({
  selector: "app-empresa-contratante",
  templateUrl: "./empresa-contratante.component.html",
  styleUrls: ["./empresa-contratante.component.scss"]
})
export class EmpresaContratanteComponent implements OnInit {
  constructor(private empresaContratanteService: EmpresaContratanteService) {}

  ngOnInit() {
    this.empresaContratanteService.getEmpresa().subscribe(result => {
      console.log(result);
    });
  }
}
