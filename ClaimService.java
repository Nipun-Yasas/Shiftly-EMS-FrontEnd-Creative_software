// Add these methods to your ClaimService interface

public interface ClaimService {
    // Existing methods...
    
    // Updated method for role-based filtering
    List<ClaimDTO> getAllClaims(String username);
    
    // Alternative method name
    List<ClaimDTO> getClaimsForAdmin(String username);
}
