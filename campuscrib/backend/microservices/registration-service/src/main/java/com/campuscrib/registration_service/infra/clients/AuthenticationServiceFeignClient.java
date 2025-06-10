package com.campuscrib.registration_service.infra.clients;

import com.campuscrib.registration_service.infra.clients.request.RegisterUserCredentialsRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "authentication-service", url = "${clients.authentication-service.base-url}")
public interface AuthenticationServiceFeignClient {
    @PostMapping("/api/auth/users/register-credentials")
    void registerUserCredentials(@RequestBody RegisterUserCredentialsRequest request);
}
