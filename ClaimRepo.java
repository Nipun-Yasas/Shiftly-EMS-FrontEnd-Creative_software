// Add this method to your ClaimRepo.java interface

@Repository
public interface ClaimRepo extends JpaRepository<ClaimEntity, Long> {
    List<ClaimEntity> findByUser_Id(Long userId);
    
    // Add this new method for department-based filtering
    List<ClaimEntity> findByUser_Department(String department);
}
