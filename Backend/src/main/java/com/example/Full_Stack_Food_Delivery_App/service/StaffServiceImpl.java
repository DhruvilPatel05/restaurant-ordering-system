package com.example.Full_Stack_Food_Delivery_App.service;

import com.example.Full_Stack_Food_Delivery_App.entity.Role;
import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import com.example.Full_Stack_Food_Delivery_App.io.StaffRequest;
import com.example.Full_Stack_Food_Delivery_App.io.StaffResponse;
import com.example.Full_Stack_Food_Delivery_App.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public StaffResponse addStaff(StaffRequest request) {

        UserEntity staff = UserEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode("123456"))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .active(request.isActive())
                .build();

        UserEntity saved = userRepository.save(staff);

        return mapToResponse(saved);
    }

    @Override
    public List<StaffResponse> getAllStaff(String search) {

        List<UserEntity> staffList =
                (search == null || search.isEmpty())
                        ? userRepository.findByRoleNot(Role.USER)
                        : userRepository.findByNameContainingIgnoreCaseAndRoleNot(search, Role.USER);

        return staffList.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public StaffResponse updateStatus(String id, boolean active) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        user.setActive(active);
        UserEntity saved = userRepository.save(user);

        return mapToResponse(saved);
    }

    @Override
    public void deleteStaff(String id) {
        userRepository.deleteById(id);
    }

    private StaffResponse mapToResponse(UserEntity user) {
        return StaffResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .active(user.isActive())
                .build();
    }
}
