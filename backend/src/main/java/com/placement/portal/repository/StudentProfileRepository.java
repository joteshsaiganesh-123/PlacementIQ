package com.placement.portal.repository;

import com.placement.portal.model.StudentProfile;
import com.placement.portal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByRollNumber(String rollNumber);
    List<StudentProfile> findByDepartment(String department);
    List<StudentProfile> findByPlaced(Boolean placed);

    @Query("SELECT COUNT(s) FROM StudentProfile s WHERE s.placed = true")
    long countPlacedStudents();

    @Query("SELECT AVG(s.packageLpa) FROM StudentProfile s WHERE s.placed = true")
    Double getAveragePlacedPackage();

    @Query("SELECT MAX(s.packageLpa) FROM StudentProfile s WHERE s.placed = true")
    Double getHighestPlacedPackage();
}
