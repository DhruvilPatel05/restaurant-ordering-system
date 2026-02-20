package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.Role;
import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import com.example.Full_Stack_Food_Delivery_App.io.UserRequest;
import com.example.Full_Stack_Food_Delivery_App.io.UserResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class  UserServiceimpl implements UserService{


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse registerUser(UserRequest userRequest) {
        UserEntity newuser = covertToEntity(userRequest);
        newuser = userRepository.save(newuser);
        return convertToUserResponse(newuser);

    }

    private UserEntity covertToEntity(UserRequest request){
        return UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .role(Role.USER)
                .build();
    }

    private UserResponse convertToUserResponse(UserEntity registerUser){
        return UserResponse.builder()
                .id(registerUser.getId())
                .name(registerUser.getName())
                .email(registerUser.getEmail())
                .build();
    }
}
