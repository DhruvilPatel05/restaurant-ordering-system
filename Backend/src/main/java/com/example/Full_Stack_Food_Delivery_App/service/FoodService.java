package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.io.FoodRequest;
import com.example.Full_Stack_Food_Delivery_App.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FoodService {

    String uploadFile(MultipartFile file);

    FoodResponse addFood(FoodRequest request, MultipartFile file);

    List<FoodResponse> readFood();

    FoodResponse readFood(String id);

    void deleteFood(String id);

    FoodResponse updateFood(String id, FoodRequest request, MultipartFile file);

    FoodResponse updateFoodStatus(String id,boolean active);

}
