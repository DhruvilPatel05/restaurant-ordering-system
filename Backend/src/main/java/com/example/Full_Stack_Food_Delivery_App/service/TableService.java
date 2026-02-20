package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.TableRequest;
import com.example.Full_Stack_Food_Delivery_App.io.TableResponse;

import java.util.List;

public interface TableService {

    TableResponse addTable(TableRequest request);

    List<TableResponse> getAllTables();
    List<TableResponse> getAvailableTables(String date, String time,int guests);


    TableResponse updateTable(String id, TableRequest request);

    void deleteTable(String id);
    TableResponse occupyTable(int tableNumber);


}