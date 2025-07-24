// Add these methods to your ClaimController.java

// Updated method for role-based claims retrieval
@GetMapping("/all")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public ResponseEntity<List<ClaimDTO>> getAllClaims(Authentication authentication) {
    return ResponseEntity.ok(claimService.getAllClaims(authentication.getName()));
}

// Alternative: Keep the existing /all endpoint and add a new filtered endpoint
@GetMapping("/admin/filtered")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public ResponseEntity<List<ClaimDTO>> getFilteredClaims(Authentication authentication) {
    return ResponseEntity.ok(claimService.getClaimsForAdmin(authentication.getName()));
}
