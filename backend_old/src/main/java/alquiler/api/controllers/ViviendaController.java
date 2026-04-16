package alquiler.api.controllers;

import alquiler.api.models.ViviendaModel;
import alquiler.api.services.IViviendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
