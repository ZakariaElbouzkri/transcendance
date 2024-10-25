from django.urls import path, include

from . import views


urlpatterns = [
    path('', views.ListUserView.as_view(), name='list_user'),
    path('<int:id>/', views.UserRetriveView.as_view(), name='user_retrieve'),
    path('me/', views.AuthUserView.as_view(), name='auth_user_view'),
    path('leaderboard/', views.LeaderBoardView.as_view(), name='leaderboard_view'),
    path('search/', views.UserSearchView.as_view(), name='user_search'),
    path('me/', include('apps.users.relationships.urls'))
]