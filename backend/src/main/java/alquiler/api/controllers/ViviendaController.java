package alquiler.api.controllers;

import alquiler.api.models.ViviendaModel;
import alquiler.api.services.IViviendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/viviendas")
public class ViviendaController {

    @Autowired
    private IViviendaService viviendaService;

    @GetMapping
    public ArrayList<ViviendaModel> getAllViviendas(){
        return this.viviendaService.getViviendas();
    }

    @GetMapping("/{id}")
    public Optional<ViviendaModel> getViviendaById(@PathVariable Long id){
        return this.viviendaService.getViviendaByID(id);
    }

    @PutMapping
    public ViviendaModel crearVivienda(@RequestBody ViviendaModel viviendaNueva) {
        return this.viviendaService.crearVivienda(viviendaNueva);
    }

    @PatchMapping("/{id}")
    public ViviendaModel actualizarVivienda(@PathVariable long id, @RequestBody ViviendaModel viviendaNueva) {
        return this.viviendaService.updateVivienda(id, viviendaNueva);
    }

    @DeleteMapping("/{id}")
    public boolean deleteVivienda(@PathVariable long id) {
        return this.viviendaService.deleteVivienda(id);
    }
}
