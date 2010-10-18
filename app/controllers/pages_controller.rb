class PagesController < ApplicationController

  respond_to :html, :js
  
  def show
    @page = Page.find(params[:id])

    @qa = QuestionnaireAnswer.new
    @qa.author = current_user
    @qa.answers = QuestionnaireAnswer.prepare_answers(@page)

    @questionnaire_answers = []
    @questionnaire_answers << @qa

    @profile = current_user
  end

  # put
  def update
    @page = Page.find(params[:id])
    if @page.update_attributes(params[:page])
      flash[:notice] = I18n.t 'pages.update.was_successful'
      # close popup
      @close_popup = true
    else
      # Failure
      flash[:error] = I18n.t 'pages.update.failed'
    end
    respond_with @page
  end

end
