package supmeal_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface MealPlanningRepository extends JpaRepository<MealPlanning, Long> {

    List<MealPlanning> findByUser(User user);

    List<MealPlanning> findByUserAndMealDate(User user, LocalDate mealDate);

}