package supmeal_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.entity.User;
import supmeal_backend.repository.MealPlanningRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MealPlanningService {

    private final MealPlanningRepository mealPlanningRepository;

    public MealPlanning save(MealPlanning mealPlanning) {
        return mealPlanningRepository.save(mealPlanning);
    }

    public List<MealPlanning> findAll() {
        return mealPlanningRepository.findAll();
    }

    public Optional<MealPlanning> findById(Long id) {
        return mealPlanningRepository.findById(id);
    }

    public List<MealPlanning> findByUser(User user) {
        return mealPlanningRepository.findByUser(user);
    }

    public List<MealPlanning> findByUserAndPlannedDate(User user, LocalDate plannedDate) {
        return mealPlanningRepository.findByUserAndPlannedDate(user, plannedDate);
    }

    public MealPlanning update(MealPlanning mealPlanning) {
        return mealPlanningRepository.save(mealPlanning);
    }

    public void delete(Long id) {
        mealPlanningRepository.deleteById(id);
    }
}
