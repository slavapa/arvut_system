class ButtonClick < ActiveRecord::Base
  belongs_to :user

  TIME_OUT = 30.minutes

  scope :last_click, lambda{ |user_id|
    where(:user_id => user_id).order("created_at DESC").limit(1)
  }

  # Selects clicks of a user for today (today timezone is the server timzone!)
  scope :today_clicks, lambda{ |user_id|
    where(:user_id => user_id).
    where("date(button_clicks.created_at) = ?", Date.today)
  }

  # Selects clicks of all users for today (today timezone is the server timzone!)
  scope :today_total_clicks, lambda{
    where("date(button_clicks.created_at) = ?", Date.today)
  }

  scope :today_total_clics_by_gourp, lambda{|email|
    today_total_clicks.
    where('user_id IN ('+User.group_users_by_email(email).to_sql+')')
  }

  scope :two_weeks_active_users_filter_by_scope, lambda{ |scope|
    two_weeks_active_users.
    where('user_id IN('+scope.to_sql+')')
  }
  
  scope :two_weeks_active_users, lambda{
    select("user_id as id").
    where("date(created_at) > ?", -2.weeks.from_now.to_date).
    group(:user_id)
  }
  
  def self.time_left(user_id)
    time_passed = (Time.now - last_click(user_id).first.created_at).to_i rescue TIME_OUT
    time_passed > TIME_OUT ? 0 : TIME_OUT - time_passed
  end

#  true - button should be green (time passed is less than TIME_OUT)
#  false - button should be red (time passed is more than TIME_OUT)
  def self.status(user_id)
    time_left(user_id) != 0
  end
end
