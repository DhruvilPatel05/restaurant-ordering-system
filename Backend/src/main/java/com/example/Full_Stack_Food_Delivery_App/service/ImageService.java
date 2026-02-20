package com.example.Full_Stack_Food_Delivery_App.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;

    public ImageService(GridFsTemplate gridFsTemplate,
                        GridFsOperations gridFsOperations) {
        this.gridFsTemplate = gridFsTemplate;
        this.gridFsOperations = gridFsOperations;
    }

    public void deleteImage(String imageId) {

        gridFsTemplate.delete(
                Query.query(Criteria.where("_id").is(imageId))
        );
    }


    public String uploadImage(MultipartFile file) {
        try {
            ObjectId id = gridFsTemplate.store(
                    file.getInputStream(),
                    file.getOriginalFilename(),
                    file.getContentType()
            );
            return id.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    public GridFsResource getImageResource(String id) {
        GridFSFile file = gridFsTemplate.findOne(
                Query.query(Criteria.where("_id").is(id))
        );

        if (file == null) {
            throw new RuntimeException("Image not found");
        }

        return gridFsOperations.getResource(file);
    }
}
