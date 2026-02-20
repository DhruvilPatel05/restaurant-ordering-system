package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.io.TableRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableResponse;
import com.example.Full_Stack_Food_Delivery_App.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @PostMapping
    public TableResponse add(@RequestBody TableRequest request) {
        return tableService.addTable(request);
    }

    @GetMapping
    public List<TableResponse> getAll() {
        return tableService.getAllTables();
    }

    @PutMapping("/{id}")
    public TableResponse update(
            @PathVariable String id,
            @RequestBody TableRequest request) {
        return tableService.updateTable(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        tableService.deleteTable(id);
    }

    @GetMapping("/available")
    public List<TableResponse> getAvailableTables(
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam int guests) {
        return tableService.getAvailableTables(date, time,guests);
    }

    @PutMapping("/occupy/{tableNumber}")
    public TableResponse occupyTable(@PathVariable int tableNumber) {
        return tableService.occupyTable(tableNumber);
    }



}