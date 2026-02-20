package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.FoodEntity;
import com.example.Full_Stack_Food_Delivery_App.io.FoodRequest;
import com.example.Full_Stack_Food_Delivery_App.io.FoodResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;
    private final ImageService imageService;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            return imageService.uploadImage(file); // GridFS
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {

        // 1️⃣ Upload image
        String imageId = uploadFile(file);
//        String imageUrl = "http://localhost:8080/images/view/" + imageId;
        String imageUrl =  imageId;
        FoodEntity food = convertToEntity(request, imageUrl);

        FoodEntity saved = foodRepository.save(food);

        return convertToResponse(saved);
    }



    @Override
    public List<FoodResponse> readFood() {
        List<FoodEntity> databaseentry = foodRepository.findAll();
        return foodRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();

    }

    @Override
    public FoodResponse readFood(String id) {
        FoodEntity food = foodRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Food not found with id: " + id
        ));
        return convertToResponse(food);
    }

    @Override
    public void deleteFood(String id) {
        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Food not found with id: " + id
                ));
        if(food.getImageUrl() != null){
            imageService.deleteImage(food.getImageUrl());
        }
        foodRepository.deleteById(id);
    }

    @Override
    public FoodResponse updateFood(String id, FoodRequest request, MultipartFile file) {
        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Food not found"));
        if(file !=null && !file.isEmpty()){
            if (food.getImageUrl() != null) {
                imageService.deleteImage(food.getImageUrl());
            }
            String newImageId = uploadFile(file);
            food.setImageUrl(newImageId);
        }
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setCategory(request.getCategory());
        food.setActive(food.isActive());
        FoodEntity saved = foodRepository.save(food);
        return convertToResponse(saved);
    }

    @Override
    public FoodResponse updateFoodStatus(String id, boolean active) {

        FoodEntity food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Food not found"));

        food.setActive(active);
        FoodEntity saved = foodRepository.save(food);
        return convertToResponse(saved);
    }


    private FoodEntity convertToEntity(FoodRequest request, String imageId) {
        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(imageId)
                .active(true)
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .imageUrl(food.getImageUrl())
                .price(food.getPrice())
                .category(food.getCategory())
                .active(food.isActive())
                .build();
    }

}
