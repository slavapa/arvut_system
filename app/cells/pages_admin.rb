class PagesAdmin < Apotomo::Widget

  helper_method :current_user, :ckeditor_toolbar
  responds_to_event :submit, :with => :process_form

  def display_form
    lang_id = Language.get_id_by_locale(params[:language] || I18n.locale)
    page_type = 'message'
    @page = Page.new(:language_id => lang_id, :author_id => current_user.id,
      :status => 'PUBLISHED', :page_type => page_type)
    render
  end
  
  def process_form
    @page = Page.new(params[:page])
    @page.assets.sort! { |a, b| a.position <=> b.position } if @page.assets
    @page.publish_at = Time.zone.now
    @success = @page.save
    render
  end
  
  def ckeditor_toolbar(klass = 'Min')
    is_rtl? ? "#{klass}_he" : klass
  end

  def is_rtl?
    I18n.locale == :he
  end

  def current_user
    @current_user ||= param :current_user
  end
  
end