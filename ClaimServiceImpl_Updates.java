// Add this method to your ClaimServiceImpl.java to replace the existing getAllClaims method

@Override
public List<ClaimDTO> getAllClaims(String username) {
    User currentUser = userRepo.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    List<ClaimEntity> claims;
    
    // Role-based filtering
    if ("SUPER_ADMIN".equals(currentUser.getRole())) {
        // Super admin can see all claims
        claims = claimRepo.findAll();
    } else if ("ADMIN".equals(currentUser.getRole())) {
        // Regular admin can only see claims from their department
        claims = claimRepo.findByUser_Department(currentUser.getDepartment());
    } else {
        // Non-admin users should not access this endpoint, but return empty for safety
        claims = new ArrayList<>();
    }
    
    return claims.stream().map(this::toDTO).collect(Collectors.toList());
}

// Alternative implementation if you want to keep the original getAllClaims and add a new method
@Override
public List<ClaimDTO> getClaimsForAdmin(String username) {
    User currentUser = userRepo.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    List<ClaimEntity> claims;
    
    // Role-based filtering
    if ("SUPER_ADMIN".equals(currentUser.getRole())) {
        // Super admin can see all claims
        claims = claimRepo.findAll();
    } else if ("ADMIN".equals(currentUser.getRole())) {
        // Regular admin can only see claims from their department
        claims = claimRepo.findByUser_Department(currentUser.getDepartment());
    } else {
        // Non-admin users should not access this endpoint
        throw new RuntimeException("Access denied: insufficient privileges");
    }
    
    return claims.stream().map(this::toDTO).collect(Collectors.toList());
}
