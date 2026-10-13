package com.placement.portal.repository;

import com.placement.portal.model.Application;
import com.placement.portal.model.ApplicationStatus;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.model.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(StudentProfile student);
    List<Application> findByStudentId(Long studentId);
    List<Application> findByDrive(PlacementDrive drive);
    List<Application> findByDriveId(Long driveId);
    Optional<Application> findByStudentIdAndDriveId(Long studentId, Long driveId);
    List<Application> findByStatus(ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = 'OFFERED'")
    long countOfferedApplications();

    @Query("SELECT COUNT(a) FROM Application a WHERE a.drive.id = :driveId")
    long countByDriveId(Long driveId);
}
