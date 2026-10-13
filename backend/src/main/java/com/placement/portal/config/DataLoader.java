package com.placement.portal.config;

import com.placement.portal.model.Company;
import com.placement.portal.model.PlacementDrive;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;

    public DataLoader(CompanyRepository companyRepository,
                      PlacementDriveRepository driveRepository) {
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed corporate partners and active placement drives if empty
        if (companyRepository.count() > 0) {
            return;
        }

        // 1. Corporate Companies
        Company google = companyRepository.save(new Company(
                "Google", "Product / Big Tech", "https://google.com/careers",
                "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120&h=120&fit=crop&q=80",
                "Mountain View, CA / Bangalore & Hyderabad",
                "Global leader in search, cloud, AI, and consumer electronics.",
                "campus-india@google.com", "Sarah Jenkins"
        ));

        Company microsoft = companyRepository.save(new Company(
                "Microsoft", "Product / Software", "https://microsoft.com/careers",
                "https://images.unsplash.com/photo-1642132652075-2b22a061456a?w=120&h=120&fit=crop&q=80",
                "Redmond, WA / Bangalore, Hyderabad, Noida",
                "Empowering every person and organization on the planet to achieve more.",
                "university-apac@microsoft.com", "Vikram Malhotra"
        ));

        Company amazon = companyRepository.save(new Company(
                "Amazon", "E-commerce & Cloud", "https://amazon.jobs",
                "https://images.unsplash.com/photo-1523474255658-4af6167c4928?w=120&h=120&fit=crop&q=80",
                "Seattle, WA / Hyderabad & Bangalore",
                "Earth's most customer-centric company, pioneer of AWS Cloud.",
                "recruiting-aws@amazon.com", "David Reynolds"
        ));

        Company oracle = companyRepository.save(new Company(
                "Oracle", "Enterprise Cloud & DB", "https://oracle.com/careers",
                "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&h=120&fit=crop&q=80",
                "Austin, TX / Bangalore & Pune",
                "World leader in autonomous databases, cloud infrastructure, and ERP solutions.",
                "university-recruiting@oracle.com", "Pooja Hegde"
        ));

        Company deloitte = companyRepository.save(new Company(
                "Deloitte", "Management & Tech Consulting", "https://deloitte.com/careers",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&h=120&fit=crop&q=80",
                "Hyderabad, Mumbai, Gurgaon",
                "Leading global provider of audit and assurance, consulting, and tax services.",
                "campusdeloitte@deloitte.com", "Kavita Rao"
        ));

        Company tcs = companyRepository.save(new Company(
                "TCS Digital", "IT Services & Consulting", "https://tcs.com/careers",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&h=120&fit=crop&q=80",
                "Pan-India across major metro centers",
                "Global leader in digital business transformation and cloud modernization.",
                "campus.digital@tcs.com", "Manoj Kulkarni"
        ));

        // 2. Verified Campus Placement Drives
        LocalDate now = LocalDate.now();

        driveRepository.save(new PlacementDrive(
                google, "Software Development Engineer (SDE-1)",
                "Full Stack & Systems Development",
                "Join Google's core engineering teams building scalable web and distributed systems used by billions.",
                28.5, 8.0, 0, "CSE,IT,AIML", 2026,
                "Java, C++, Data Structures, Algorithms, System Design, SQL, Git",
                now.plusDays(10), now.plusDays(5), "ACTIVE", 8, "Bangalore / Hybrid"
        ));

        driveRepository.save(new PlacementDrive(
                microsoft, "Cloud Solution Engineer",
                "Azure Cloud & Platform Solutions",
                "Design and architect resilient enterprise solutions on Azure with AI copilot integration.",
                24.0, 7.5, 0, "CSE,IT,AIML,ECE", 2026,
                "Python, FastApi, Azure, Cloud Computing, SQL, Docker, React",
                now.plusDays(14), now.plusDays(7), "ACTIVE", 12, "Hyderabad / Noida"
        ));

        driveRepository.save(new PlacementDrive(
                oracle, "Full Stack Java Developer",
                "Enterprise Cloud Apps",
                "Develop high-performance microservices with Spring Boot, Java, and modern web frameworks.",
                16.5, 7.0, 0, "CSE,IT,AIML,ECE", 2026,
                "Java, Spring Boot, MySQL, REST API, React, Microservices",
                now.plusDays(20), now.plusDays(12), "ACTIVE", 15, "Bangalore / Pune"
        ));

        driveRepository.save(new PlacementDrive(
                amazon, "Software Development Engineer - AWS",
                "Distributed Infrastructure",
                "Build massive multi-tenant cloud services with sub-millisecond latencies.",
                32.0, 8.5, 0, "CSE,IT,AIML", 2026,
                "Java, Distributed Systems, Python, AWS, SQL, NoSQL",
                now.plusDays(18), now.plusDays(10), "ACTIVE", 5, "Hyderabad"
        ));

        driveRepository.save(new PlacementDrive(
                deloitte, "Technology Analyst",
                "Advisory & Digital Transformation",
                "Bridge the gap between enterprise business challenges and cutting-edge tech architectures.",
                9.5, 6.5, 1, "ALL", 2026,
                "SQL, Python, Java, Problem Solving, Communication, Analytical Skills",
                now.plusDays(25), now.plusDays(18), "ACTIVE", 25, "Gurgaon / Hyderabad"
        ));

        driveRepository.save(new PlacementDrive(
                tcs, "Digital Cadre Systems Engineer",
                "Software Engineering",
                "High-performance digital transformation role with rapid fast-track career path.",
                7.5, 6.0, 1, "ALL", 2026,
                "Java, Python, C++, Data Structures, Web Development, SQL",
                now.plusDays(30), now.plusDays(22), "UPCOMING", 40, "Pan India"
        ));
    }
}
